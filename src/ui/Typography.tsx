interface TypographyProps {
  component?: keyof JSX.IntrinsicElements;
  fontSize?: number | string;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({
  component: Component = "p",
  fontSize,
  color,
  children,
  className = "",
}: TypographyProps) => {
  const style = {
    fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    color,
  };

  return (
    <Component style={style} className={className}>
      {children}
    </Component>
  );
};
