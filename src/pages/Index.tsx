import Bento from "../components/home/Bento";
import CallToAction from "../components/home/CallToAction";
import TaskilaLayout from "../components/home/Features";
import Price from "../components/home/Price";
import Seamless from "../components/home/Seamless";
import Wall from "../components/home/Wall";
import Navbar from "../components/shared/Navbar";

const Index = () => {
  return (
    <div>
      <section className="relative h-[60vh] sm:min-h-screen rounded-t-[50px] md:rounded-t-[100px] bg-white overflow-hidden">
        <div className="p-6 md:p-14">
          <Navbar />
        </div>
        <section className="h-[40vh] md:h-[50vh] flex items-center p-6 md:p-14 text-black relative z-10">
          <div className="text-5xl sm:text-8xl font-thin text-left sm:-mt-20 mt-0">
            Transform your
            <br /> business with Taskila
          </div>
        </section>
        <div className="absolute bottom-0 w-full flex justify-center">
          <img
            src="/desk.png"
            alt="Taskila desk"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
      <CallToAction />
      <Bento />
      <Seamless />
      <TaskilaLayout />
      <Price />
      <Wall />
    </div>
  );
};

export default Index;
