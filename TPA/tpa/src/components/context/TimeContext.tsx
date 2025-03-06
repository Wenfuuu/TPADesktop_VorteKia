import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type TimeContextType = {
  currentTime: Date;
};

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={{ currentTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error("useTime must be used within a TimeProvider");
  }
  return context;
};