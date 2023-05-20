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
    transition('login => Register', slideTo('left')),
    transition('Register => login', slideTo('right')),
    transition('login => Register', slideTo('left')),
    transition('Register => login', slideTo('right'))
  ]);

function slideTo(direction: string) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'fixed',
        // top: 0,
        // [direction]: 0,
        top: '50%',
        left: '50%',
        transform: 'translate(50%, 50%) scale(0.8)',
        // width: '100%',
        opacity: 0
      })
    ], optional),
    query(':enter', [
      
      animate('100ms', style({ opacity: 1, transform: ' scale(1)' }))
    ],optional),
    group([
      query(':leave', [
        animate('100ms', style({ opacity: 0, transform: ' scale(0.8)' }))
      ], optional),
      query(':enter', [
        animate('300ms', style({ opacity: 1, transform: 'scale(1)' }))
      ],optional)
    ]),
    // Normalize the page style... Might not be necessary

  ];
}




