import { useReveal } from '../utils/useReveal';

/**
 * Wraps content in a fade/slide-in-on-scroll container.
 * Respects prefers-reduced-motion via CSS.
 */
export default function Reveal({ children, className = '', ...rest }) {
  const [ref, revealClass] = useReveal();
  const divRef = /** @type {any} */ (ref);
  return (
    <div ref={divRef} className={`${revealClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
