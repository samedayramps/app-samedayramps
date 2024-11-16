import { getBusinessSettings } from "@/app/actions/settings";

export async function calculateDeliveryDistance(destinationAddress: string) {
  try {
    const settings = await getBusinessSettings();
    const warehouseAddress = settings.warehouseAddress;

    // Create a new instance of the Distance Matrix Service
    const service = new google.maps.DistanceMatrixService();

    // Get the distance between warehouse and destination
    const response = await service.getDistanceMatrix({
      origins: [warehouseAddress],
      destinations: [destinationAddress],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    });

    if (
      response.rows[0]?.elements[0]?.status === "OK" &&
      response.rows[0]?.elements[0]?.distance
    ) {
      // Convert meters to miles and round to 1 decimal place
      // Multiply by 4 for round trips (2 trips × 2 for there and back)
      const oneWayDistance = response.rows[0].elements[0].distance.value * 0.000621371;
      const totalDistance = +(oneWayDistance * 4).toFixed(1); // Round to 1 decimal place
      return totalDistance;
    }

    console.error("Failed to calculate distance:", response);
    return 0;
  } catch (error) {
    console.error("Error calculating delivery distance:", error);
    return 0;
  }
} 