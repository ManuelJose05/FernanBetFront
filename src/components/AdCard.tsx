import { Card } from "primereact/card";
import {ReactNode} from "react";

interface CardProps {
    title: string;
    urlImage: string;
    backgroundSize:string;
    body: ReactNode
}

const AdCard = (props:CardProps) => {
    return (
        <Card
            title={props.title}
            className="flex text-center align-items-center justify-content-center md:pt-2 sm:pt-2"
            style={{
                backgroundImage: `url(${props.urlImage})`,
                backgroundSize: props.backgroundSize,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: 'white',
                height: '250px',
                width: '100%',
            }}
        >
            <div className="bg-black-alpha-70 p-2 border-round overflow-hidden w-full">
                {props.body}
            </div>
        </Card>
    );
};

export default AdCard;