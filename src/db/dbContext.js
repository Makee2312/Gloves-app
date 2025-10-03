import Dexie from "dexie";

export const dbContext = new Dexie("gloveAppDB");
dbContext.version(1).stores({
  settings: "id", // in-line primary key 'id'
});
