export const endpoint = document.location.href.startsWith('http://localhost') ?`http://localhost:3000/graphql` : '';
export const endpointWS = `${document.location.origin.replace('http', 'ws')}/graphql`; 
// export const endpoint = 'http://localhost:3001/graphql';
// export const endpointWS = 'ws://localhost:3001/graphql';