import { createStyles, fade, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
    return createStyles({
        toolbar: {
          justifyContent: 'space-around',
        },
        boxArtwork: {
          visibility: 'hidden',
          opacity: 0,
          transition: 'all 1s ease'
        },
        showArtwork:{
          visibility: 'visible',
          opacity: 1,
        },
        rootArtwork: {
          minWidth: 275,
          display: 'flex',
          flexDirection: 'column',
        },
        bulletArtwork: {
          display: 'inline-block',
          margin: '0 2px',
          transform: 'scale(0.8)',
        },
        titleArtwork: {
          fontSize: 14,
        },
        posArtwork: {
          // marginBottom: 12,
          fontSize: 14,
          
        },
        starActive: {
          "&> path":{ fill:"#ffff00"},
          // "&> path:hover": { fill: '#fff'}
      
        },
        starInactive: {
          "&> path":{ fill:"#bbb"}
        },
        artwork: {
          display: 'grid',
          width: '90vw',
          height: '90vh',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          // overflow: 'scroll',
          textDecoration: 'none',
          // position: 'relative',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `
            "header header header header"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"
            "main main main main"`,
        },
        chapter: {
          overflow: 'scroll',
          gridArea: 'chapter',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateX(-100%)',
          opacity: 0,
          background: 'white',
          width: '30%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          transition: 'all 0.5s ease',
        },
        libraryChapter: {
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 2rem 1rem 2rem',
          cursor: 'pointer',
          transition:' all 0.75s ease-out',
          textDecoration: 'none',
          '& > img': {
            width: '30%',
          },
          '&:hover': {
            background: 'rgb(235, 235, 235)',
          },
        },
        descriptionChapterButton: {
          paddingLeft: '1rem',
        },
        header: {
          gridArea: 'header',
          position: 'relative',
          transition: 'all 0.5s ease',
        },
        text: {
          gridArea: 'main',
          height: '100%',
          overflow: 'scroll',
          paddingRight: '20px',
          wordWrap: 'break-word',
          transition: 'all 0.5s ease',
        }
        ,
        button: {
          color: fade(theme.palette.common.white, 1),
          '&:hover': {
            color: fade(theme.palette.common.white, 1),
          },
          '&:focus': {
            color: fade(theme.palette.common.white, 1),
          },
        },
        search: {
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: fade(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
          },
          marginLeft: 0,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
          },
        },
        searchIcon: {
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        inputRoot: {
          color: 'inherit',
          height: '100%'
        },
        inputInput: {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        paper: {
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
          border: '1px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(1, 2, 2),
          borderRadius: '20px',
          outline: 'none',
          overflow: 'hidden'
        },
        active: {
          transform: 'translateX(0)',
          opacity: 1
        },
        libraryActive: {
          marginLeft: '30%',
        },
        textarea: {
          '& > textarea': {
            height: '100%'
          }
        }
      })});
    
export default useStyles;