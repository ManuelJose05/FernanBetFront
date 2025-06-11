import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {ReactNode} from "react";
import "../styles/AnuncioCard.css"
import AdCard from "./AdCard";

const HomeTabPage = () => {

    const adCardBody1 = (
        <section>
            <h4>PRIMEROS 100XP POR PARTICIPAR</h4>
        </section>
    )
    const adCardBody2 = (
        <section>
            <h4>SE EL MÁS RÁPIDO Y CANJEA REGALOS</h4>
        </section>
    )

    const title:ReactNode = <span style={{color: 'black'}}>CREAR <span style={{color: '#228061'}}>PREDICCIÓN+</span></span>


    return (
        <div className="flex flex-column gap-2 align-items-center justify-content-center">

            {/* 1. Card principal de crear predicción */}
            <Card id={"card-anuncio"} title={title} className="xl:w-6 lg:w-6 sm:w-full md:w-full zoomindown animation-duration-1000"
                  style={{
                      backgroundImage: 'url("https://elfutbolessagrado.com/wp-content/uploads/2023/07/escandalos-de-apuestas-en-el-futbol-y-como-afectan-a-la-integridad-del-juego-image.jpeg")',
                      backgroundSize: 'cover',
                  }}
            >
                <div className="flex flex-row gap-3 align-items-start justify-content-between">
                    <section className="flex flex-column align-items-start justify-content-start">
                        <p>Los mejores encuentros y partidos en un mismo lugar</p>
                        <Button label="Empezar a construir" />
                    </section>
                </div>
            </Card>

            {/* 2. AdCards promocionales */}
            <section className="flex flex-row gap-3 w-full overflow-x-scroll zoominup animation-duration-1000">
                <AdCard
                    title="OFERTA"
                    backgroundSize="cover"
                    urlImage="/images/football.png"
                    body={adCardBody1}
                />
                <AdCard
                    title="REGALOS"
                    backgroundSize="cover"
                    urlImage="/images/runner.png"
                    body={adCardBody2}
                />
            </section>

            {/* 3. Trivia */}
            <hr className="border-2 border-gray-300 w-full" />
            <span className={"text-bold text-2xl pb-2"}>Sección de preguntas</span>
            <Card id="card-anuncio" title="Trivia Deportiva" className="w-full md:w-10">
                <p>¿Cuál de estos equipos ha ganado más mundiales?</p>
                <div className="flex gap-2 flex-wrap">
                    <Button label="Brasil" className="p-button-sm" />
                    <Button label="Alemania" className="p-button-sm" />
                    <Button label="Francia" className="p-button-sm" />
                </div>
            </Card>

            {/* 4. Consejo del día */}
            <Card id={"card"} title="Consejo del día 🧠" className="w-full md:w-10">
                <p>⚽ ¡Recuerda! Lo más divertido es jugar en equipo y aprender cosas nuevas.</p>
            </Card>

        </div>
    );

};

export default HomeTabPage;