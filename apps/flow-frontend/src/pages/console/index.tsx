export default function Overview() {
  return (
    <div className="h-[800px] flex items-center justify-cente">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">欢迎来到我的网站</h1>
          <p className="text-gray-600 mb-6">
            这里有你想要的一切，让我们开始探索吧！
          </p>
          <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
            开始探索
          </div>
          <button className=" bg-slate-600 sr-only">111</button>
        </div>
      </div>
    </div>
  );
}
