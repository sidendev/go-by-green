import axios from "axios";

const postRoutesByUserId = (routeDetails, travel_mode, user_id) => {
  console.log(routeDetails, routeDetails.start_location_lat, travel_mode, user_id, "<<<<<<<< from postRoutesByUserId");
  return axios
    .post(
      `https://gobygreen.onrender.com/api/users/${user_id}/user_routes`,
      {
        origin_address: routeDetails.start_address,
        destination_address: routeDetails.end_address,
        origin_lat: routeDetails.start_location_lat,
        origin_long: routeDetails.start_location_lng,
        destination_lat: routeDetails.end_location_lat,
        destination_long: routeDetails.end_location_lng,
        carbon_usage: routeDetails.carbon_usage,
        route_distance: routeDetails.distance,
        mode_of_transport: travel_mode,
        route_time: routeDetails.duration,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((res) => {
      console.log(res, "<<<<<< response from axios")
    })
    .catch((err) => {
      console.log(err, "<<<<<<<< error from axios");
    });
};

export { postRoutesByUserId };

