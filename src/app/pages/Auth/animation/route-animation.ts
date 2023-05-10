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
    // Normalize the page style... Might not be necessary

  ];
}




