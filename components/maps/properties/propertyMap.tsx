"use client";
import {
	GoogleMap,
	InfoWindow,
	LoadScript,
	Marker,
	StreetViewPanorama,
} from "@react-google-maps/api";
import Lottie from "lottie-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Define a more specific type for Lottie animation data
interface LottieAnimationData {
	// Using unknown is better than any for type safety
	[key: string]: unknown;
}

type PropertyMapProps = {
	latitude: number;
	longitude: number;
	address: string;
	details: string;
};

const mapContainerStyle = {
	width: "100%",
	height: "400px", // Increased height for better view
	borderRadius: "15px",
	overflow: "hidden",
	position: "relative" as const,
};

const PropertyMap: React.FC<PropertyMapProps> = ({
	latitude,
	longitude,
	address,
	details,
}) => {
	const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(
		null,
	);
	const [homeAnimation, setHomeAnimation] =
		useState<LottieAnimationData | null>(null);
	const [isStreetView, setIsStreetView] = useState(false);
	const [mapTypeId, setMapTypeId] = useState<"satellite" | "roadmap">(
		"satellite",
	);
	const [pano, setPano] = useState<string | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);

	const center = useMemo(
		() => ({ lat: latitude, lng: longitude }),
		[latitude, longitude],
	);

	useEffect(() => {
		fetch("/lottie/HousePing.json")
			.then((response) => response.json())
			.then((data: LottieAnimationData) => setHomeAnimation(data));
	}, []);

	const onLoad = useCallback(
		(map: google.maps.Map) => {
			mapRef.current = map;
			const streetViewService = new google.maps.StreetViewService();
			streetViewService.getPanorama(
				{ location: center, radius: 50 },
				(data, status) => {
					if (
						status === google.maps.StreetViewStatus.OK &&
						data?.location?.pano
					) {
						setPano(data.location.pano);
						const panorama = map.getStreetView();
						panorama.setPosition(center);
						panorama.setOptions({ enableCloseButton: false });
						streetViewRef.current = panorama;
					}
				},
			);
		},
		[center],
	);

	const mapOptions = {
		mapTypeId,
		disableDefaultUI: true,
		zoomControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		fullscreenControl: true,
	};

	const handleStreetViewToggle = () => {
		const nextIsStreetView = !isStreetView;
		setIsStreetView(nextIsStreetView);
		if (streetViewRef.current) {
			streetViewRef.current.setVisible(nextIsStreetView);
		}
	};

	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_KEY ?? ""}>
			<div style={mapContainerStyle}>
				<GoogleMap
					mapContainerStyle={{ width: "100%", height: "100%" }}
					center={center}
					zoom={18}
					options={mapOptions}
					onLoad={onLoad}
				>
					{!isStreetView && (
						<>
							<Marker position={center} onClick={() => setSelected(center)} />
							{selected && (
								<InfoWindow
									position={selected}
									onCloseClick={() => setSelected(null)}
								>
									<div
										style={{
											color: "black",
											display: "flex",
											alignItems: "center",
										}}
									>
										{homeAnimation && (
											<Lottie
												animationData={homeAnimation}
												style={{ height: 30, width: 30, marginRight: 10 }}
											/>
										)}
										<div style={{ flex: 1 }}>
											<h2
												className="font-bold"
												style={{ fontSize: "1rem", margin: 0 }}
											>
												{address}
											</h2>
											<p style={{ fontSize: "0.875rem", margin: 0 }}>
												{details}
											</p>
										</div>
									</div>
								</InfoWindow>
							)}
						</>
					)}
				</GoogleMap>

				{/* Custom Controls */}
				<div
					style={{
						position: "absolute",
						top: "20px",
						right: "20px",
						zIndex: 1,
						display: "flex",
						gap: "8px",
					}}
				>
					<button
						type="button"
						onClick={handleStreetViewToggle}
						className="px-3 py-2 bg-white bg-opacity-80 text-sm font-semibold text-gray-800 rounded-lg shadow-md hover:bg-opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!pano}
					>
						{isStreetView ? "Exit Street View" : "Street View"}
					</button>
					<button
						type="button"
						onClick={() =>
							setMapTypeId(mapTypeId === "satellite" ? "roadmap" : "satellite")
						}
						className="px-3 py-2 bg-white bg-opacity-80 text-sm font-semibold text-gray-800 rounded-lg shadow-md hover:bg-opacity-100"
					>
						{mapTypeId === "satellite" ? "Map View" : "Satellite View"}
					</button>
				</div>
			</div>
		</LoadScript>
	);
};

export default PropertyMap;
