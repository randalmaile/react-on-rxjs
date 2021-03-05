import React, { useEffect, useState } from 'react'
import { ajax } from 'rxjs/ajax';
import { merge, of, forkJoin, timer } from 'rxjs';
import Error from '../Error';
import { catchError, debounceTime, delay, filter, map, pluck, switchMap, tap, take
} from 'rxjs/operators';

import causeTroubleController from './causeTroubleController';

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fafafa",
  },
  media: {
    height: 200,
  },
});

export default function Cat({cat}) {
  const classes = useStyles();
  const { causeTrouble, hereComesTrouble$ } = causeTroubleController();

  function clickHandler () {
    causeTrouble(cat);
  }

  return (
     <div>
      <Container >
        <Grid>
          <Card className={classes.card}>
            <CardMedia
              style={{height: '100px', width: '100px'}}
              className={classes.media}
              image={cat.image.url}
            />
            <Button variant="contained" color="primary" onClick={clickHandler}>
              Cause Trouble
            </Button>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Cat name: {cat.name} <br/>
                Origin: {cat.origin}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </div>
  )
}
