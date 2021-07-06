import { useMutation } from '@apollo/client';
import { faCheck, faStar, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import useStyles from '../Styles/useStyles';
import {CREATE_DELETE_RATING, CREATE_RATING, DELETE_RATING} from '../../utils/graphql'


export const Rating = ({artworks,artwork, user, subscribeToMore}) => {
    const classes = useStyles();
    const [stateRating, setStateRating] = useState(false)
    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null)
    
    // const {data,}
    console.log(artwork.id);

    useEffect(()=> {
        const unsubscribe = subscribeToMore({
          document: CREATE_DELETE_RATING,
          variables: { artworkId: artwork.id},
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const {operation, artwork} = subscriptionData.data.publishRatings;
            if(operation === 'CREATE_AND_DELETE_RATING'){
                const newArtworks = prev.getArtworks.map(arg => {
                    console.log(artwork);
                    return arg.id === artwork.id ? artwork : arg 
                })
                return {getArtworks: newArtworks}
            }
          },
        });
    
        return () => {
          unsubscribe();
        };
      }, [subscribeToMore])
    
    
    const [CreateRating, {loading: createLoading}] = useMutation(CREATE_RATING);
    const [DeleteRating, {loading: deleteLoading}] = useMutation(DELETE_RATING)

    const ratingUser = artwork.ratings.find(rat => rat?.user.id === user?.id)
    
    return (
        <>
            {stateRating ? 
                (
                    <>
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        display: 'flex',
                        width: '150px',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <span style={{position: 'relative', height: '3rem'}}>
                            Do you want to remove your rating?
                            <span>
                                <IconButton 
                                    style={{fontSize: '1rem'}}
                                    onClick={async()=> {
                                        await DeleteRating({
                                            variables: {
                                                ratingId: ratingUser.id
                                            },
                                            update() {
                                                setStateRating(!stateRating)
                                            }
                                        })

                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                </IconButton>
                                <IconButton 
                                    style={{fontSize: '1rem'}}
                                    onClick={()=> setStateRating(!stateRating)}
                                >
                                    <FontAwesomeIcon icon={faTimes}/>
                                </IconButton>
                            </span>
                        </span>
                        
                    </span>
                    </>
                ) 
                : 
                <>
                    ({artwork.ratingsQuantity || 0}) 
                    {[1,2,3,4,5].map((star,i) => {
                            return (
                                <label 
                            key={star}
                            style={{cursor: 'pointer'}}
                            >
                                <input 
                                    style={{display: 'none'}}
                                    type="radio"
                                    name="rating"
                                    value={star}
                                    onClick={() => (!ratingUser &&  user) ? setRating(star): user && setStateRating(!stateRating)}
                                />
                                <FontAwesomeIcon 
                                className={star <= (hover|| artwork.    ratingsAverage ) ? classes.starActive   : classes.starInactive} 
                                onMouseEnter={()=> (!ratingUser &&  user) && setHover(star)}
                                onMouseLeave={()=> (!ratingUser &&  user) && setHover(null)}
                                icon={faStar}
                                />
                            </label>
                            )
                    })}
                    {artwork.ratingsAverage} / 5 
                    {rating && 
                    <span 
                        style={{
                            position: 'absolute',
                            top: '15px',
                            width: '100%',
                            left: 0,
                            textAlign: 'center'
                        }}
                    >
                        <span  
                            style={{
                                position: 'relative',       
                            }}>
                            Ваша оценка {rating}
                            <span style={{
                                    position: "absolute",
                                    display: "flex",
                                    justifyContent:" flex-end",
                                    top: "9px",
                                    right: "0",
                                    width: "100%",
                            }}>
                                <IconButton 
                                    style={{fontSize: '1rem', padding: '10px'}}
                                    onClick={async()=> {
                                        await CreateRating({
                                            variables: {
                                                input: {
                                                    rating,
                                                    artwork: artwork.id,
                                                    user: user.id   
                                                }
                                            },
                                            update() {
                                                setRating(null)
                                            }
                                        })

                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck}/>
                                </IconButton>
                                <IconButton 
                                    style={{fontSize: '1rem', padding: '10px'}}
                                    onClick={()=> setRating(null)}
                                >
                                    <FontAwesomeIcon icon={faTimes}/>
                                </IconButton>
                            </span>
                        </span>
                    </span>}
                </>
            }
        </>
    )
}
