import { membersColRef, vehiclesColRef } from "@/lib/firebase";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Box,
  Text,
  Flex,
  Badge,
  chakra,
  Link,
  Heading,
} from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import WhiteButton from "./design/WhiteButton";

export default function Vehicles() {
  useEffect(() => {
    const fetchDocs = async () => {
      const res = await getDocs(vehiclesColRef);
      const users = (await getDocs(membersColRef)).docs.map((d) => ({
        ...d.data(),
        uid: d.id,
      })) as Array<MemberDocType>;

      const docs = (
        res.docs.map((doc) => doc.data()) as Array<VehicleDocType>
      ).map((d) => ({
        ...d,
        owner_data: users.filter((u) => u.uid == d.owner)[0],
      }));
      setVehicles(docs);
    };

    fetchDocs();
  }, []);

  const [vehicles, setVehicles] = useState<Array<VehicleDocType>>([]);
  const [vehicleCount] = useDocsCount(vehiclesColRef);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDocType | null>(
    null
  );

  const [vehiclesToShow, paginationIndices, setActiveIdx] =
    usePagination<VehicleDocType>(vehicles, 15);

  return (
    <>
      <Flex width="100%" flexDir="column" gap="1rem" height="100%">
        <ContentHeader
          description="Catalog of all vehicles available in you automation fleet"
          heading={`Vehicles (${vehicleCount})`}
        />
        <Flex gap={"0.1rem"}>
          <VehiclesList vehicles={vehiclesToShow} />
          <VehicleDetail vehicle={vehicles[0]} />
        </Flex>
      </Flex>
    </>
  );
}

const VehicleDetail = ({ vehicle }: { vehicle: VehicleDocType }) => {
  return (
    <Flex
      flex={1}
      bg="var(--grey-color)"
      rounded="lg"
      height={"auto"}
      padding={"0.5rem"}
      flexDir={"column"}
      gap={"1rem"}
    >
      <Heading fontSize={"xl"}>Vehicles</Heading>
      <img
        width={"100%"}
        height={"auto"}
        src={vehicle.thumbnail}
        style={{ borderRadius: "0.5rem" }}
      />
      <Flex justifyContent={"center"}>
        <Heading fontSize={"2xl"}>{vehicle.title}</Heading>
      </Flex>
    </Flex>
  );
};

const VehiclesList = ({ vehicles }: { vehicles: Array<any> }) => {
  return (
    <>
      <Flex
        flex={3}
        width={"100%"}
        height={"100vh"}
        maxH={"100vh"}
        minHeight={"100vh"}
        flexDir={"column"}
        gap={"1rem"}
        py={0}
      >
        <Flex
          flexWrap={"wrap"}
          gap={"0.5rem"}
          overflowY={"auto"}
          flexBasis={"100%"}
          justifyContent={"center"}
          width={"100%"}
        >
          {vehicles.map((vehicle, idx) => {
            return <VehicleData vehicle={vehicle} key={idx} />;
          })}
        </Flex>
        <Flex flexBasis={"17%"}>
          <WhiteButton>1</WhiteButton>
        </Flex>
      </Flex>
    </>
  );
};

import { Image } from "@chakra-ui/next-js";
import { MemberDocType, VehicleDocType } from "@/lib/firebase_docstype";
import { useDocsCount } from "@/lib/hooks/useDocsCount";
import usePagination from "@/lib/hooks/usePagination";

const VehicleData = ({ vehicle }: { vehicle: VehicleDocType }) => {
  return (
    <>
      {/*eslint-disable-next-line @next/next/no-img-element */}
      <Box rounded={"lg"} pb={"1rem"} bg={"var(--grey-color)"}>
        <Image
          src={vehicle.thumbnail}
          alt="vehicle_image"
          height={180}
          width={280}
          quality={100}
          borderRadius={"var(--chakra-radii-lg)"}
          style={{ objectFit: "fill" }}
        />
        <Flex p={"0.1rem"} flexDir={"column"}>
          <Heading fontSize={"md"}>{vehicle.title}</Heading>
          <Text fontWeight={"light"} fontSize={"sm"}>
            {vehicle.owner_data ? vehicle.owner_data.name : "Unknown"}
          </Text>
        </Flex>
      </Box>
    </>
  );
};
