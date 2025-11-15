import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Info from "@/components/subscription/Info";
import Create from "./components/modal/Create";
import { useAppDispatch } from "./store/hooks";
import { hydrateItems } from "./store/thunks/itemThunks";
import Upcoming from "./components/subscription/Upcoming";
import HighestSpending from "./components/subscription/HighestSpending";
import Budget from "./components/subscription/Budget";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate.toISOString());
      dispatch(
        hydrateItems(`fromDate=${selectedDate.toISOString().split("T")[0]}`)
      );
    }
  }, [selectedDate]);

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

  const InfoUi = () => {
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
        </div>
      </>
    );
  };

  return (
    <div className="bg-neutral-950 flex justify-center items-center min-h-screen">
      <div className="w-[500px]">
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
                        {selectedDate && <InfoUi />}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// function App() {
//   const dispatch = useAppDispatch();

//   const fetchSubscriptions = async () => {
//     dispatch(hydrateItems());
//   };

//   useEffect(() => {
//     fetchSubscriptions();
//   }, []);
//   useEffect(() => {
//     const query = location.search.replace("?", "").split("&");
//     for (const param of query) {
//       const value = param.split("=");
//       if (
//         value[0] === "filter" &&
//         (value[1] === "7-days" || value[1] === "30-days")
//       ) {
//         dispatch(updateDateFilter(value[1] as DateRangeFilter));
//       }
//     }
//   }, []);

//   return (
//     <main className="bg-black text-white min-h-screen flex justify-center items-center">
//       <div className="flex flex-wrap">
//         <SubscriptionFilters />

//         <div className="border border-white border-solid w-full">
//           <div className="mb-2 p-2">
//             <div className="space-x-2 mb-2 flex justify-end">
//               <button
//                 onClick={() => dispatch(setActiveModal("info"))}
//                 className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
//               >
//                 <Info />
//               </button>
//               <button
//                 onClick={() => dispatch(setActiveModal("editing"))}
//                 className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
//               >
//                 <Plus />
//               </button>
//             </div>

//             <SubscriptionList
//               refresh={fetchSubscriptions}
//               onEdit={(subscription: Subscription) => {
//                 dispatch(updateEditingItem(subscription));
//                 dispatch(setActiveModal("editing"));
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <ModalContainer />
//     </main>
//   );
// }

export default App;
