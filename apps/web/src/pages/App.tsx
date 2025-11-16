import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  hydrateItems,
  hydrateHighestSpendingItem,
  hydrateUpcomingItem,
  hydrateTotalSpend,
} from "@/store/thunks/itemThunks";
import { hydrateSettings } from "@/store/thunks/settingsThunks";
import Upcoming from "@/components/subscription/Upcoming";
import HighestSpending from "@/components/subscription/HighestSpending";
import Budget from "@/components/subscription/Budget";
import Info from "@/components/subscription/Info";
import Create from "@/components/modal/Create";
import Version from "@/components/Version";
import { ArrowRight } from "lucide-react";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { setIsLoading } from "@/store/reducers/itemSlice";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      dispatch(
        hydrateItems(`fromDate=${selectedDate.toISOString().split("T")[0]}`)
      );
    }
  }, [selectedDate]);
  useEffect(() => {
    dispatch(hydrateSettings());
    dispatch(hydrateTotalSpend());
    dispatch(hydrateHighestSpendingItem());
    dispatch(hydrateUpcomingItem());
    dispatch(setIsLoading(false));
  }, []);

  const CalendarUi = () => {
    return (
      <Calendar
        className="mx-auto"
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
    );
  };

  const InfoUi = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
      <>
        <div className="overflow-y-auto overflow-x-hidden h-68">
          <Info />
        </div>
        <div className="py-2">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild className="w-full">
              <Button className="w-full">Create</Button>
            </DialogTrigger>
            <DialogContent className="dark text-white">
              <Create
                closeModal={() => setModalOpen(false)}
                date={selectedDate}
              />
            </DialogContent>
          </Dialog>

          {isMobile && (
            <div className="mt-2">
              <Button
                onClick={() => setSelectedDate(undefined)}
                type="button"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-neutral-950 flex justify-center items-center min-h-screen">
      <div className="w-[500px]">
        <div className="p-2 opacity-50">
          <p
            onClick={() => navigate("/settings")}
            className="text-white inline text-xs hover:cursor-pointer"
          >
            Settings
            <ArrowRight className="inline" size={15} />
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* upcoming */}
          <div className="col-span-2">
            <Upcoming />
          </div>

          {/*  */}
          <div className="col-span-1">
            <Budget />
          </div>

          {/*  */}
          <div className="col-span-1">
            <HighestSpending />
          </div>

          {/* calendar */}
          <div className="col-span-2">
            <Card className="dark">
              <CardContent className="space-y-2">
                <div>
                  {/* desktop */}
                  <div className="hidden md:grid md:grid-cols-2 gap-x-18">
                    <div
                      className={`transition-all duration-500 ${
                        selectedDate
                          ? "md:col-span-1"
                          : "md:col-span-2 md:flex md:justify-center"
                      }`}
                    >
                      <CalendarUi />
                    </div>

                    {/* Second cell - fades in from right */}
                    <div
                      className={`transition-all duration-500 ${
                        selectedDate
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4 pointer-events-none"
                      }`}
                    >
                      {selectedDate && <InfoUi />}
                    </div>
                  </div>

                  {/* mobile */}
                  <div className="md:hidden h-full">
                    <div className="relative h-full">
                      <div
                        className={`inset-0 transition-opacity duration-500 ${
                          selectedDate
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        {!selectedDate && <CalendarUi />}
                      </div>

                      {/* subscription info */}
                      <div
                        className={`inset-0 transition-opacity duration-500 ${
                          selectedDate
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        {selectedDate && <InfoUi isMobile={true} />}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 mx-auto pb-5">
        <Version />
      </div>
    </div>
  );
}

export default App;
