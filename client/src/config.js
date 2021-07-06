export const endpoint = document.location.href.startsWith('http://localhost') ?`http://localhost:4001/graphql` : '';
export const endpointWS = `ws://localhost:4001/graphql`; 
