import { assert } from "jsr:@std/assert";
import GtfsRealtimeBindings from "npm:gtfs-realtime-bindings@1.1.1";

const ODPT_2024_TOKEN = Deno.env.get("ODPT_2024_TOKEN");
assert(ODPT_2024_TOKEN);

const vehicleUrl = new URL(
  "https://api-challenge2024.odpt.org/api/v4/gtfs/realtime/jreast_odpt_train_vehicle",
);
vehicleUrl.searchParams.set("acl:consumerKey", ODPT_2024_TOKEN);

const tripUpdateUrl = new URL(
  "https://api-challenge2024.odpt.org/api/v4/gtfs/realtime/jreast_odpt_train_trip_update",
);
tripUpdateUrl.searchParams.set("acl:consumerKey", ODPT_2024_TOKEN);

const res = await fetch(tripUpdateUrl);
const body = await res.arrayBuffer();

const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
  new Uint8Array(body),
);

console.log(feed.header);
for (const entity of feed.entity) {
  console.log(entity.id);
  console.log(entity.tripUpdate?.delay);
  for (const stopTimeUpdate of entity.tripUpdate?.stopTimeUpdate ?? []) {
    console.log(stopTimeUpdate.arrival);
    console.log(stopTimeUpdate.departure);
    console.log(stopTimeUpdate.scheduleRelationship);
    console.log(stopTimeUpdate.stopId);
    console.log(stopTimeUpdate.stopSequence);
    console.log(stopTimeUpdate.stopTimeProperties);
  }
  // console.log(entity.tripUpdate?.trip);
}
