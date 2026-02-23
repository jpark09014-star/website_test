export default function GroupingBox({
  total,
  part1,
  part2,
}: {
  total: number | "?";
  part1: number | "?";
  part2: number | "?";
}) {
  return (
    <div className="w-40 sm:w-48 mx-auto mt-3 mb-4 rounded border-2 border-gray-800 bg-white overflow-hidden text-2xl font-bold flex flex-col items-center">
      {/* 윗 칸 (전체) */}
      <div className="w-full border-b-2 border-gray-800 py-3 uppercase flex items-center justify-center text-gray-900 bg-white min-h-[50px]">
        {total === "?" ? <span className="text-gray-300 font-normal">?</span> : total}
      </div>

      {/* 아랫 칸 (두 부분) */}
      <div className="w-full grid grid-cols-2">
        <div className="border-r-2 border-gray-800 py-3 flex items-center justify-center text-blue-600 bg-white min-h-[50px]">
          {part1 === "?" ? <span className="text-gray-300 font-normal">?</span> : part1}
        </div>
        <div className="py-3 flex items-center justify-center text-gray-900 bg-white min-h-[50px]">
          {part2 === "?" ? <span className="text-gray-300 font-normal">?</span> : part2}
        </div>
      </div>
    </div>
  );
}
