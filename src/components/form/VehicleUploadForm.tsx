import { UseDisclosureProp } from "@/types/UseDisclosureProp";
import ModalWrapper, { ModalDropDown, ModalInput } from "../design/ModalWrapper";
import { Flex, Heading } from "@chakra-ui/react";
import OrangeButton from "../design/OrangeButton";

const VehicleUploadForm = (
    {handler} : {handler : UseDisclosureProp }
) => {

    
    return <ModalWrapper {...handler}>
        <Flex alignItems={'center'} flexDir={'column'} color={'black'} gap={'1rem'}>
            <Heading fontSize={'20px'} fontWeight={'700'}>
                Add New Vehicle
            </Heading>
        </Flex>

        <Flex flexDir={'column'} width={'100%'} gap={'0.5rem'}>
                <ModalDropDown
                    labelValue={'Contact Type'}
                    menuItems={['foo']}
                    menuTitle={'Please Select'}
                    onSelected={(s) => {
                    }}
                />

                <ModalInput
                    labelValue="Nickname (Optional)"
                    isOptional={true}
                />

                <ModalInput
                    labelValue="Year"
                    placeholder={"eg. 2019"}
                    isOptional={false}
                />

                <ModalDropDown
                    labelValue={'Make'}
                    menuItems={['make']}
                    menuTitle={'Please Select'}
                    onSelected={(s) => {
                    }}
                />

                <ModalInput 
                    labelValue="Model"
                    placeholder="e.g. Aventador"
                />

                <ModalInput 
                    labelValue="Trim"
                    placeholder="e.g. Aventador"
                />

                <ModalInput 
                    labelValue="Mileage"
                    placeholder="e.g. 10,500"
                />

                <ModalInput 
                    labelValue="Mileage"
                />
                
                <OrangeButton width={'100%'}>
                    Create Vehicle
               </OrangeButton>
        </Flex>
    </ModalWrapper>   
}

export default VehicleUploadForm;