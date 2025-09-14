import { motion } from "motion/react"

const Cracked = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center overflow-y-hidden px-4">
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <motion.h1
          className="
            text-white font-juana font-semibold text-center
            text-3xl sm:text-4xl md:text-6xl lg:text-7xl
          "
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay:0.5 }}
        >
          Welcome Developers
        </motion.h1>

        <motion.h1
          className="
            text-white font-neue text-center
            text-5xl sm:text-6xl md:text-8xl lg:text-9xl
          "
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Cracked Black
        </motion.h1>
      </div>
    </div>
  )
}

export default Cracked
