import Container from "@/components/container";
import Input from "@/components/input";
import { GameCard } from "@/components/gameCard";
import { GameProps } from "@/utils/types/game";

async function getData(title: string) {
    try {
        const decodeTitle = decodeURI(title)
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&title=${decodeTitle}`)
        return res.json();
    } catch (err) {
        throw new Error("Ocorreu um erro")
    }
}

export default async function Search({ params: { title } }: { params: { title: string } }) {
    const games: GameProps[] = await getData(title)
    return (
        <main className="w-full text-black">
            <Container>
                <Input />

                <h1 className="font-bold text-xl mt-8 mb-5">Veja oque encontramos na nossa base:</h1>


            {games ? (
                <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {games.map(item => {
                        return (
                            <GameCard key={item.id} game={item} />
                        )
                    })}
                </section>
            ) :(
                <p className="text-center">Esse jogo não foi encontrado!...</p>
            )}
            </Container>
        </main>
    )
}

