import React, { useState, useEffect } from 'react';
import { Subject} from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { merge, of, timer } from 'rxjs';

// Using RxJS - creating a simple subject to broker component communication
const hereComesTroubleSubject = new Subject();
const hereComesTrouble$ = hereComesTroubleSubject.asObservable();

const causeTrouble = (trouble) => {
  console.log('Our cat is sending trouble to our Subject(data Store)');
  hereComesTroubleSubject.next(trouble);
}

const rogueElement$ = hereComesTrouble$.pipe(
  switchMap(({name, origin, temperament, image}) => {
    return of(
      <Container>
      <Grid>
        <Card style={{
            maxWidth: 345,
            boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
            backgroundColor: "#fafafa",
          }}>
          <CardMedia
            style={{height: '100px', width: '100px'}}
            style={{height: 200}}
            image={image.url}
          />
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              <h2>Who cares about your profile, here's mine:</h2>
              <p>I'm a {name} cat from {origin} and my temperament is: {temperament}</p>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Container>
    )
  })
);

// Custom hook for the Modal component - one job - control the state of the modal
export default function causeTroubleController() {
  return {
    hereComesTrouble$,
    causeTrouble,
    rogueElement$
  }
}
