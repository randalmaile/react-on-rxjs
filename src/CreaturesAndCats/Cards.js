import React, { useEffect, useState } from 'react'
import { ajax } from 'rxjs/ajax';
import { merge, of, forkJoin } from 'rxjs';
import Error from '../Error';
import { catchError, debounceTime, delay, filter, map, pluck, switchMap, tap, take
} from 'rxjs/operators';

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Cat from './Cat';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fafafa",
  },
  media: {
    height: 200,
  },
  container: {
    marginTop: '200px'
  }
});

const finalSpaceCharacterUrl = 'https://finalspaceapi.com/api/v0/character/?limit=12';
const catBreedsUrl = 'https://api.thecatapi.com/v1/breeds';
const finalSpaceCharacters$ = ajax.getJSON(finalSpaceCharacterUrl);
const catBreeds$ = ajax.getJSON(catBreedsUrl);

export default function Cards() {
  const [mashedUpCharacers, setData] = useState([]);

  useEffect(() => {
    // Great way to compbine obserbables - much like:Promise.all() 
    // https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
    forkJoin([finalSpaceCharacters$, catBreeds$]).pipe(
      map(([spaceCharacters, catBreeds]) => {
        return spaceCharacters.map((character, index) => {
          character['cat'] = catBreeds[index];
          return {...character};
        })
      }),
      tap(characters => {
        console.log('Our space characters with their cats', characters);
      }),
      catchError(error => of(<Error {...error} />))
    ).subscribe(characters => {
        setData(characters);
    });

    return () => {}
  }, []);

  const classes = useStyles();

  return (
     <div style={{marginTop: '100px'}}>
      <Container>
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h4"
          align="center"
        >
          A bunch of space characters and their cats:{" "}
        </Typography>
        <Grid container spacing={3} style={{marginBottom:'300px'}}>
          { mashedUpCharacers && mashedUpCharacers.map((character) => (
            <Grid item xs={12} sm={4} key={character.id}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={character.img_url}
                />
                <CardContent>
                  <Typography color="primary" variant="h5">
                    {character.name}
                  </Typography>

                  <Typography color="textSecondary" variant="subtitle2">
                    {character.status}
                  </Typography>
                  <Cat cat={character.cat}/>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  )
}
