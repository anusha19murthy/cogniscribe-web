export const magneticEffect = (element: HTMLElement, strength = 0.35) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    element.style.transform = `translate(${dx}px, ${dy}px)`;
    element.style.transition = 'transform 0.15s ease';
  };

  const handleMouseLeave = () => {
    element.style.transform = 'translate(0, 0)';
    element.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export const tiltEffect = (element: HTMLElement, maxTilt = 15) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -maxTilt;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * maxTilt;
    element.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    element.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = () => {
    element.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    element.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};
