import Logo from './Logo';
import CitySkyline from './CitySkyline';

/**
 * LogoScene — the official Fighting Chance logo staged in a generated
 * city scene. The source logo PNG has empty black corners, so this
 * component fills the free space around the badge with procedural
 * city buildings (left and right clusters, plus a faint distant row)
 * — recreating the "logo over the skyline" presentation from the flyers
 * as a sharp, resolution-independent composition.
 *
 * Layout: a wide canvas with the logo centered and two skyline SVGs
 * anchored to the bottom, left and right, partially tucked behind the
 * logo badge. Purely decorative — hidden from screen readers.
 */
export default function LogoScene({ size = 300 }) {
  return (
    <div className="logo-scene" aria-hidden="true">
      <CitySkyline className="logo-scene__sky logo-scene__sky--back" depth="back" seed={11} />
      <CitySkyline className="logo-scene__sky logo-scene__sky--left" depth="mid" seed={23} fit="slice" />
      <CitySkyline className="logo-scene__sky logo-scene__sky--right" depth="mid" seed={41} fit="slice" flip />
      <Logo className="logo-scene__logo" size={size} />
    </div>
  );
}
