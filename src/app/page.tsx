import Container from "@/components/container"
import { GameProps } from "@/utils/types/game";
import Input from "@/components/input"
import Link from "next/link";
import Image from "next/image";
import { BsArrowRightSquare } from "react-icons/bs"
import { GameCard } from "@/components/gameCard";

async function getEBGame() {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, { next: { revalidate: 320 } })
    return res.json();
  } catch (err) {
    throw new Error("Failed to fetch data")
  }
}

async function getGameData() {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=games`, { next: { revalidate: 320 } })
    return res.json();
  } catch (err) {
    throw new Error("Failed to fetch data")
  }
}

export default async function Home() {
  const ebGame: GameProps = await getEBGame();
  const gameData: GameProps[] = await getGameData();

  return (
    <main className="w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8 mb-5">Separamos um jogo exclusivo para você.</h1>
        <Link href={`/game/${ebGame.id}`}>
          <section className="w-full bg-black rounded-lg">
            <div className="w-full max-h-96 h-96 relative rounded-lg">
              <div className="absolute z-20 bottom-0 p-3 flex justify-center items-center gap-2">
                <p className="font-bold text-xl text-white">{ebGame.title}</p>
                <BsArrowRightSquare size={24} color="#FFF" />
              </div>
              <Image
                src={ebGame.image_url}
                alt={ebGame.title}
                priority={true}
                quality={100}
                fill={true}
                className="max-h-96 object-cover rounded-lg opacity-50 hover:opacity-100 transition-all duration-300"
                sizes="(max-width: 768px) 100vw, (maxwidth: 1200px) 33vw"
              />
            </div>
          </section>
        </Link>

        <Input />

        <h2 className="text-lg font-bold mt-8 mb-5">Jogos para conhecer</h2>

        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gameData.map(item => {
            return (
              <GameCard key={item.id} game={item}/>
            )
          })}
        </section>
      </Container>
    </main>
  )
}
