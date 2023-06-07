import { UseDisclosureProp } from "@/types/UseDisclosureProp";
import ModalWrapper, { ModalDropDown, ModalInput } from "../design/ModalWrapper";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import OrangeButton from "../design/OrangeButton";
import { useState } from "react";
import { MemberDocType } from "@/lib/firebase_docstype";

const VehicleUploadForm = (
    {handler, customers} : {handler : UseDisclosureProp, customers: MemberDocType[] }
) => {

    const initialFormState = {
        customer: '',
        nickname: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        mileage: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        const newErrors: any = {};
        
        if (!formState.customer) {
          newErrors.customer = 'Please select a customer';
        }
    
        if (!formState.year) {
          newErrors.year = 'Please enter a year';
        } else if (!/^\d{4}$/.test(formState.year)) {
          newErrors.year = 'Please enter a valid 4-digit year';
        }
    
        if (!formState.make) {
          newErrors.make = 'Please select a make';
        }
    
        if (!formState.model) {
          newErrors.model = 'Please enter a model';
        }
    
        if (!formState.trim) {
          newErrors.trim = 'Please enter a trim';
        }
    
        if (!formState.mileage) {
          newErrors.mileage = 'Please enter mileage';
        } else if (!/^\d+$/.test(formState.mileage)) {
          newErrors.mileage = 'Please enter a valid mileage';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toast = useToast();

    const handleInputChange = (name: string, value: any) => {
        setFormState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };
    
    const handleSubmit = () => {
    
        const isValid = validateForm();
        
        if (isValid) {
          // Submit the form or perform desired actions
          // For example, show a success toast message
          toast({
            title: 'Form submitted',
            description: 'Vehicle added successfully',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
    
          // Reset the form state
          setFormState(initialFormState);
          setErrors({});
        } else {
          // Show an error toast message or handle form errors
          // For example, show an error toast message
          toast({
            title: 'Form error',
            description: 'Please fix the form errors',
            status: 'error',
            duration: 3000,
            isClosable: true
          });
        }
    };

    return (
        <ModalWrapper {...handler}>
          <Flex alignItems="center" flexDir="column" color="black" gap="1rem">
            <Heading fontSize="20px" fontWeight="700">
              Add New Vehicle
            </Heading>
          </Flex>
      
          <Flex flexDir="column" width="100%" gap="0.5rem" color="black">
            <ModalDropDown
              labelValue="Customer"
              menuItems={customers.map(c => c.name).filter (n => n != "").sort()}
              menuTitle="Please Select"
              onSelected={(s) => handleInputChange('customer', s)}
              error={errors.customer}
            />
      
            <ModalInput
              labelValue="Nickname (Optional)"
              isOptional={true}
              value={formState.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              error={errors.nickname}
            />
      
            <ModalInput
              labelValue="Year"
              placeholder="e.g. 2019"
              isOptional={false}
              value={formState.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              error={errors.year}
            />
      
            <ModalDropDown
              labelValue="Make"
              menuItems={['BMW']}
              menuTitle="Please Select"
              onSelected={(s) => handleInputChange('make', s)}
              error={errors.make}
            />
      
            <ModalInput
              labelValue="Model"
              placeholder="e.g. Aventador"
              value={formState.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              error={errors.model}
            />
      
            <ModalInput
              labelValue="Trim"
              placeholder="e.g. Aventador"
              value={formState.trim}
              onChange={(e) => handleInputChange('trim', e.target.value)}
              error={errors.trim}
            />
      
            <ModalInput
              labelValue="Mileage"
              placeholder="e.g. 10,500"
              value={formState.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              error={errors.mileage}
            />

            <OrangeButton width="100%" onClick={handleSubmit}>
              Create Vehicle
            </OrangeButton>
          </Flex>
        </ModalWrapper>
    );
        
}

export default VehicleUploadForm;