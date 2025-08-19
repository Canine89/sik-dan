import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  ...props 
}) => {
  const baseClass = 'card';
  const variantClass = variant === 'light' ? 'glass-light' : 'glass';
  const clickableClass = onClick ? 'card-clickable' : '';
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${clickableClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;