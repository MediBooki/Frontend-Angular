// import { trigger } from "@angular/animations";

import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
  state,
} from '@angular/animations';



export const slider =
  trigger('routeAnimations', [
    transition('* => Register', slideTo('left')),
    transition('* => login', slideTo('right')),
    transition('login => *', slideTo('left')),
    transition('Register => *', slideTo('right'))
  ]);

function slideTo(direction: string) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%' })
    ]),
    group([
      query(':leave', [
        animate('2.3s ease', style({ [direction]: '100%' }))
      ], optional),
      query(':enter', [
        animate('2.3s ease', style({ [direction]: '0%' }))
      ])
    ]),

  ];
}




