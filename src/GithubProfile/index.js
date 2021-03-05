import React, { useEffect } from 'react';
import { componentFromStream } from 'recompose';
import { merge, of, timer } from 'rxjs';
import {catchError,combineLatest,debounceTime,delay, filter, map, pluck,switchMap, tap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import Error from '../Error';
import Component from './DumbComponent';
import './Profile.css';
import causeTroubleController from '../CreaturesAndCats/causeTroubleController';


const formatUrl = user => `https://api.github.com/users/${user}`;

// https://github.com/acdlite/recompose/blob/master/docs/API.md#componentfromstream
const User = componentFromStream(prop$ => {
  const { rogueElement$ } = causeTroubleController();
  const loading$ = of(<h3>Loading...</h3>);

  const getUser$ = prop$.pipe(
    tap(props => {
      // console.log(`Let's look at our User props`, props);
    }),
    // only passes the most recent after a give time delay
    debounceTime(1000),
    pluck('user'),
    filter(user => user && user.length),
    map(formatUrl),

    // Taking an (outer) observable & cancels the previous (inner) subscription and starts a new one
    switchMap(url => {
      // Here we are combining multiple streams (loading$ and the ajax request & rogueElement) and funnels them into one stream (order is not important - emissions occur naturally)
     return merge(
        rogueElement$,
        loading$,
        ajax(url).pipe(
          // nice little shortcut - just pluck out the property you wish to grab from emited item
          pluck('response'),
          // tap lets you inspect the response
          tap(response => {
            // console.log('Ajax response', response)
          }),
          map(Component),
          catchError(error => of(<Error {...error} />))
        )
      ).pipe(
        tap(elements => console.log('GithubProfile element stream', elements.type))
      )
    }
    )
  );

  return getUser$;
});

export default User;
