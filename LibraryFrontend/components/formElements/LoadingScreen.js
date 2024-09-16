import { View, Text, Spinner, HStack } from "@gluestack-ui/themed";

export default function LoadingScreen() {
    
  return (
    <>
      <View style={{alignItems: 'center', paddingBottom: 20}}>
        <HStack space="sm">
          <Spinner />
          <Text size="lg">Please Wait!...</Text>
        </HStack>
      </View>
    </>
  );
}
