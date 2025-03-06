import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "blue" | "outline-blue" | "outline-white";
}

export default function Button({ children, className, variant = 'blue', ...rest }: ButtonProps) {
    return (
        <button        
            {...rest}
            className={clsx(
                "flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors",
                variant === "blue" && "bg-LvlupBlue text-white hover:bg-LvlupBlue-light active:bg-LvlupBlue-dark",
                variant === "outline-blue" && "border border-LvlupBlue text-white bg-transparent hover:bg-LvlupBlue-dark active:bg-LvlupBlue-dark2",
                variant === "outline-white" && "border border-white text-white bg-transparent hover:bg-white/10 active:bg-white/20",
                className
            )}
        >
            {children}
        </button>
    )
}