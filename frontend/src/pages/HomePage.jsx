import Project1 from "../assets/images/proyek-1.webp";

const HomePage = () => {
  return (
    <div className="homepage bg-gray-100 min-h-screen pt-28 px-4 sm:px-6 md:px-12">
      <div className="bg-white shadow-lg rounded-2xl p-8 md:p-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-12">
          <div className="box w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Hi Welcome to my hut
            </h1>
            <p className="text-gray-700 text-base leading-relaxed mb-8 text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              tristique purus orci libero egestas ut. Augue suspendisse blandit
              lorem massa ipsum, urna, egestas mi, lacinia. Dui fusce etiam
              libero, lectus amet, risus molestie malesuada. Odio nam purus
              consectetur euismod congue leo quisque. Turpis amet sollicitudin
              nunc non in lectus dolor amet. Amet ullamcorper faucibus tincidunt
              accumsan ac adipiscing arcu. Donec tristique at proin maecenas.
              Ante elit et iaculis ac sit.
            </p>

            <div className="mb-3">
              <a
                href="https://www.linkedin.com/in/david-bayu"
                className="inline-block bg-gray-900 text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-gray-700 transition-all"
              >
                contact
              </a>
            </div>

            <div className="mb-6">
              <a
                href="/CV.pdf"
                download="David-Bayu-CV.pdf"
                className="inline-flex items-center gap-2 text-gray-800 font-medium"
              >
                download CV <i className="ri-download-2-line text-lg"></i>
              </a>
            </div>

            <div className="flex justify-center sm:justify-start gap-4 text-2xl text-black">
              <a href="https://www.linkedin.com/in/david-bayu">
                <i className="ri-linkedin-box-fill hover:text-blue-600 transition"></i>
              </a>
              <a href="https://www.instagram.com/crish00_?igsh=MXcxbzV3OXg3ZzQwZw==">
                <i className="ri-instagram-fill hover:text-pink-500 transition"></i>
              </a>
              <a href="#">
                <i className="ri-facebook-box-fill hover:text-blue-800 transition"></i>
              </a>
              <a href="#">
                <i className="ri-twitter-fill hover:text-sky-500 transition"></i>
              </a>
              <a href="https://github.com/davidbayu1805">
                <i className="ri-github-fill text-2xl text-gray-800"></i>
              </a>
            </div>
          </div>

          <div className="flex justify-center -mt-5" id="Profile">
            <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-xs w-full">
              <img
                src={Project1}
                alt="Profile image"
                className="w-full h-[260px] object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-1">David Bayu Cristanto</h3>
                <p className="text-sm text-gray-600">Fullstack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
