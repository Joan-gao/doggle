import React from "react";
import {
  Card,
  CardMedia,
  CardTitle,
  CardText,
  CardActions,
  Button,
} from "@chatui/core";

function CardComponent() {
  return (
    <Card size="xl">
      <CardMedia image="//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png" />
      <CardTitle>Card title</CardTitle>
      <CardText>Card content</CardText>
      <CardActions>
        <Button>Default button</Button>
        <Button color="primary">Primary button</Button>
      </CardActions>
    </Card>
  );
}

export default CardComponent;
