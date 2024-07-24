import { GeoJsonPoint } from "@/core/domain/map/geo-json-point.model";
import { validate } from "class-validator";
function validatePayload(payload: any) {
  return new Promise((resolve, reject) => {
    validate(payload)
      .then((result) => resolve(result.length ? false : true))
      .catch(() => reject(false));
  });
}
describe("Validators", () => {
  describe("validate-point-coordinates-right", () => {
    it("it should return a truthy", async () => {
      // Arrange
      const data = new GeoJsonPoint(1, 2);
      
      // Act
      const validationResult = await validatePayload(data);

      // Assert
      expect(validationResult).toBeTruthy();
    });
  });

  describe("validate-point-coordinates-wrong", () => {
    it("it should return a falsy", async () => {
      // Arrange
      const data = new GeoJsonPoint(0, 0);
      data.coordinates = [0];

      // Act
      const validationResult = await validatePayload(data);

      // Assert
      expect(validationResult).toBeFalsy();
    });
  });
});
