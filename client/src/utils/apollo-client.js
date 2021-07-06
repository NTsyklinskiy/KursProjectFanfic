import { ApolloClient, ApolloLink, Observable, split, InMemoryCache, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
// import { HttpLink } from '@apollo/client/core';
import { createUploadLink } from 'apollo-upload-client';


const createAuthLink = () => {
  const request = (operation, forward) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  };

  return new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );
};

const handleErrors = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
};

export const createApolloClient = (apiUrl, websocketApiUrl) => {
  const cache = new InMemoryCache();

  const errorLink = handleErrors();
  const authLink = createAuthLink();

  const uploadLink = createUploadLink({ 
    credentials: 'same-origin',
    uri: apiUrl,
    timeout: 60000,
    fetchOptions: {
      method: 'POST',
    },
    headers: {
      "keep-alive": "true"
    } 
});
  // const uploadLink = new HttpLink({
    // uri: apiUrl,
    // timeout: 120000,
  // })

  const authToken = localStorage.getItem('token');
  const wsLink = new WebSocketLink({
    uri: websocketApiUrl,
    options: {
      // timeout: 60000,
      reconnect: true,
      connectionParams: {
        authorization: authToken,
      },
    },
  });

  wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
    wsLink.subscriptionClient.maxConnectTimeGenerator.max;

  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    uploadLink
  );

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, terminatingLink]),
    cache,
  });
};