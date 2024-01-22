import './rounded-box-with-color.component.scss';

interface RoundedBoxWithColorProps {
    color: string;
    onClick: () => void;
}

export const RoundedBoxWithColorComponent: React.FC<RoundedBoxWithColorProps> = (props: RoundedBoxWithColorProps) => {
    return (
        <div className='rounded-box-with-color-container' style={{ backgroundColor: props.color }} onClick={props.onClick}>
        </div>
    );
}