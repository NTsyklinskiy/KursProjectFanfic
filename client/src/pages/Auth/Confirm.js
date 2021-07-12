import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import React from 'react'
import { withRouter } from 'react-router'
import { IS_CONFIRM } from '../../utils/graphql';

const Confirm = ({history, location, refetch}) => {
    const token = location.pathname.split('/')[2]
    const {data, loading, error} = useQuery(IS_CONFIRM, {
        variables: {token},
    })
    const isConfirm = data?.isConfirmUserMail.isConfirm 

    if(isConfirm){
        (async() => {
            localStorage.setItem('token', token);
            await refetch();
            history.push('/')})()
    }
    
    return (
           <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}/>
    )
}


export default withRouter(Confirm)