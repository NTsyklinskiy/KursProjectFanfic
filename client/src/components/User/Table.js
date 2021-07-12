import React from 'react'
import { Button, ButtonGroup, Container, Row, Table  } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { BLOCK_USERS, DELETE_USERS, UNBLOCK_USERS } from '../../utils/graphql';
import useCheckbox from '../../hooks/useCheckbox';
import { Checkbox } from './Checkbox';

function conversionDate(data) {
  let date = new Date(+data);
  date = date.toString().split(' ')
  return `${date[2]} ${date[1]} ${date[3]} ${date[4]}`;
}

function keyId(checkeds){
  return Object.keys(Object.fromEntries(Object.entries(checkeds).filter(([key,value]) => {
    return value !== false
  })));
}

export const TableUsers = ({user, users}) => {
  
    const {checkeds, handleChange, handleChangeAll, handleChangeNo} = useCheckbox(users)

    const[deleteUsers,{ loading: loadingDelete, error: errorDelete}] = useMutation(DELETE_USERS)
    
    const[blockUsers,{ loading: loadingBlock, error: errorBlock}] = useMutation(BLOCK_USERS)
    const[unBlockUsers,{ loading: loadingUnBlock, error: errorUnBlock}] = useMutation(UNBLOCK_USERS)
    const handlerBlock = async() => {
      try {
        const blockId = keyId(checkeds);

        await blockUsers({
          variables:  {
            usersIds:blockId,
        },    
        })
     
      }catch(e) {
        console.error(e);
      }
    } 

    const handlerUnBlock = async() => {
      try {
        const unBlockId = keyId(checkeds);
        
        await unBlockUsers({
          variables:  {
            usersIds:unBlockId,
        },    
        })
        
      }catch(e) {
        console.error(e);
      }
    }

    const handlerDelete = async () => {
      try {
        const deleteId = keyId(checkeds)
        if(deleteId.some(e=> e === user?.id)){
          window.localStorage.removeItem('token')
        }

        
        await deleteUsers({
          variables:  {
            usersIds:deleteId,
        },    
        })
       
      }catch(e) {
        console.log(e);
      }
    }    


    return (
      <>
      <Row className="justify-content-center">
        <ButtonGroup>
          <Button onClick={handlerBlock}>Block</Button>
          <Button onClick={handlerUnBlock}>UnBlock</Button>
          <Button variant="danger" onClick={handlerDelete}>Delete</Button>
        </ButtonGroup>
      </Row>
      
        <Table striped bordered hover >
            <thead>
              <tr>
                <th>
                <ButtonGroup size="sm">
                  <Button onClick={handleChangeAll}>
                  All
                  </Button>
                  <Button onClick={handleChangeNo}>
                  No
                  </Button>
                </ButtonGroup>
                
                </th>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date</th>
                <th>Last Login</th>
                <th>Online Offline</th>
                <th>Status Block</th>
              </tr>
            </thead>
            <tbody>
            {users && users?.map((u, i)=> {
            return (
                <tr key={u.id}>
                  <td>
                  <Checkbox name={u.id} checked={checkeds[u.id]} onChange={handleChange} />
                  </td>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{conversionDate(u.createdAt)}</td>
                  <td>{conversionDate(u.lastLoginAt)}</td>
                  <td>{u.isOnline === true ? 'Online' : 'Offline'}</td>
                  <td>{u.active === true ? 'Not Blocked' : 'Blocked'}</td>
                </tr>
            )
            })
            }
        </tbody>
        </Table>
        </>
    )
}


