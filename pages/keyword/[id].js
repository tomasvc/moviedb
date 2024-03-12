import React, { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { useHeaderContext } from '../../contexts/headerContext'
import { fetchItemsByKeyword, fetchKeyword } from '../../api'
import { useRouter } from 'next/router'
import moment from 'moment'
import clsx from 'clsx'

export default function Keyword() {
  const { open, setOpen } = useHeaderContext()
  const router = useRouter()
  const { id } = router.query

  const [results, setResults] = useState()
  const [keyword, setKeyword] = useState()

  useEffect(() => {
    async function fetchData() {
        const results = await fetchItemsByKeyword(id);
        const keyword = await fetchKeyword(id);
        setResults(results);
        setKeyword(keyword)
    }

    if (id) {
        fetchData();
    }
  }, [id]);

  return (
    <div className="bg-slate-50/30">
        <Header open={open} setOpen={setOpen} />
        <main className={clsx("px-20 py-10 pt-20 flex flex-col gap-4 xl:w-1/2 mx-auto", {"blur-md": open})}>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-7 bg-blue-400" />
                <h1 className="uppercase tracking-wide">{keyword?.name}</h1>
            </div>
            {results?.results?.map((item, index) => {
                return <div key={index} className="rounded bg-white flex shadow-md border">
                    <div className="w-28">
                        <img className="rounded-tl rounded-bl" src={`https://image.tmdb.org/t/p/w400${item?.poster_path}`} />
                    </div>
                    <div className="p-4 flex flex-col justify-between w-full">
                        <div>
                        <p className="text-xl font-semibold">{item?.title || item?.original_title || item?.name}</p>
                        <p className="text-gray-500/70 text-sm">{item?.release_date && moment(item.release_date).format("MMMM D, YYYY")}</p>
                        </div>
                        {item?.overview && <p className="text-sm">{item.overview}</p>}
                    </div>
                </div>
            })}
        </main>
    </div>
  )
}
