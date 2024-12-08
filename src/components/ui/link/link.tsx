import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: string;
} & NextLinkProps;

export const Link = ({ className, children, href, ...props }: LinkProps) => {
  return (
    <NextLink className={className} href={href} {...props}>
      {children}
    </NextLink>
  );
};
