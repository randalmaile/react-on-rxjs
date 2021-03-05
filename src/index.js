import React from 'react';
import ReactDOM from 'react-dom';
import { componentFromStream, createEventHandler } from 'recompose';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import User from './GithubProfile';
import './observableConfig';
import './styles.css';
import Cards from './CreaturesAndCats/Cards';


// The idea is that our props become an observable, and we map them to a React component.
const App = componentFromStream(prop$ => {

  // createEventHandler: the handler is bound to an event and pushes values to a stream
  const { handler, stream } = createEventHandler();

  const value$ = stream.pipe(
    map(e => e.target.value.trim()),
    //  This operator emits something - sort of like initializing a stream!!
    startWith('')
  );

  // This creation method is cool because it takes that last emitted value (both streams must emit fot this to work!!)
  return combineLatest(prop$, value$).pipe(
    map(([props, value]) => (
      <div>
        <input onChange={handler} placeholder="GitHub username" />
        <User user={value} />
        <Cards />
      </div>
    ))
  );
});

const rootElement = document.getElementById('root');
ReactDOM.render(<App dil="dil" />, rootElement);
