import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Lil Nouns Auction</title>
        <meta name="description" content="Live and passed auctions, with more detail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center items-center">
        <div className="m-auto">
          <h1 className="text-3xl">Lil Nouns Auction</h1>
          <p className="text-xl">We are building something!</p>
        </div>
      </main>
    </>
  )
}
