import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { GET_ALL_USERS } from '../../utils/graphql'
import { TableUsers } from './Table'

export const AdminPanel = ({user, setUsersId}) => {
    const {data,loading, error} = useQuery(GET_ALL_USERS)
    const [users, setUsers] = useState([])

    useEffect(() => {
      setUsers(data?.allUsers)
      setUsersId(() => {
          return data?.allUsers.map(u => {
              return u.id
          })
      })
    }, [data])

    return (
        <>
        {
          !!users?.length && 
            <TableUsers user={user} users={users}/>
        }
        </>
    )
}
