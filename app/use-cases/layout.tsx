export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col max-w-2xl mx-auto items-center justify-center my-8">
      <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
        {children}
      </div>
    </main>
  )
}
