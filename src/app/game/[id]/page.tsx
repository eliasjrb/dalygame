import Container from "@/components/container";
import { GameProps } from "@/utils/types/game";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Label } from "./components";
import { GameCard } from "@/components/gameCard";
import { Metadata } from "next";

interface PropsParams {
    params: {
        id: string;
    }
}

export async function generateMetadata({ params }: PropsParams): Promise<Metadata> {
    try {
        const response = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${params.id}`, { next: { revalidate: 60 } })
            .then((res) => res.json())
            .catch(() => {
                return {
                    title: "DalyGames - Descubra jogos incríveis para se divertir."
                }
            })

            return {
                title: `DalyGames - ${response.title}`, 
                description: `${response.description.slice(0,100)}...`,
                openGraph: {
                    title: response.title,
                    images: [response.image_url]
                }, 
                robots: {
                    index: true,
                    follow: true,
                    nocache: true,
                    googleBot: {
                      index: true,
                      follow: true,
                      noimageindex: true
                    }
                  }
            }
    } catch (err) {
        return {
            title: "DalyGames - Descubra jogos incríveis para se divertir."
        }
    }
}

async function getData(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`, { cache: "no-store" })
        return res.json();
    } catch (err) {
        throw new Error(`Ocorreu um erro: ${err}`)
    }
}

async function getGameSorted() {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, { cache: "no-store" })
        return res.json();
    } catch (err) {
        throw new Error(`Ocorreu um erro: ${err}`)
    }
}


export default async function Game({ params: { id } }: { params: { id: string } }) {

    const gameSorted: GameProps = await getGameSorted();
    const data: GameProps = await getData(id);
    if (!data) {
        redirect("/")
    }
    return (
        <main className="w-full text-black">
            <div className="bg-black h-80 sm:h-96 w-full relative">
                <Image
                    className="object-cover w-full h-80 sm:h-96 opacity-75"
                    src={data.image_url}
                    alt={data.title}
                    priority={true}
                    fill={true}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (maxwidth: 1200px) 44vw"
                />
            </div>
            <Container>
                <h1 className="font-bold text-xl my-4">{data.title}</h1>
                <p>{data.description}</p>

                <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.platforms.map(item => (
                        <Label name={item} key={item} />
                    ))}
                </div>

                <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.categories.map(item => (
                        <Label name={item} key={item} />
                    ))}
                </div>

                <p className="mt-7 mb-2"><strong>Data de lançamento:</strong> {data.release}</p>

                <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado:</h2>
                <div className="flex">
                    <div className="flex-grow">
                        <GameCard game={gameSorted} />
                    </div>
                </div>
            </Container>
        </main>
    )
}