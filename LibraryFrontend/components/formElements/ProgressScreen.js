import { View, Text, Progress, ProgressFilledTrack, VStack } from "@gluestack-ui/themed";

export default function ProgressScreen({process}) {
  // console.log("process",process)
  return (
    <>
      <View style={{ alignItems: "center", paddingBottom: 20 }}>
        <VStack space="lg">
          <Text size="lg">{`Uploading ${process * 100}%`}</Text>
          <Progress value={process * 100} w="$80" h="$1">
            <ProgressFilledTrack h="$1" />
          </Progress>
        </VStack>
      </View>
    </>
  );
}
