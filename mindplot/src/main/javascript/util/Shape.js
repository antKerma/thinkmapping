/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.util.Shape =
{
    isAtRight:function (sourcePoint, targetPoint) {
        $assert(sourcePoint, "Source can not be null");
        $assert(targetPoint, "Target can not be null");
        return sourcePoint.x < targetPoint.x;
    },

    calculateRectConnectionPoint:function (rectCenterPoint, rectSize, isAtRight) {
        $assert(rectCenterPoint, 'rectCenterPoint can  not be null');
        $assert(rectSize, 'rectSize can  not be null');
        $assert($defined(isAtRight), 'isRight can  not be null');

        // Node is placed at the right ?
        var result = new core.Point();

        // This is used fix a minor difference ...z
        var correctionHardcode = 2;
        if (isAtRight) {
            result.setValue(rectCenterPoint.x - (rectSize.width / 2) + correctionHardcode, rectCenterPoint.y);
        } else {
            result.setValue(parseFloat(rectCenterPoint.x) + (rectSize.width / 2) - correctionHardcode, rectCenterPoint.y);
        }

        return result;
    },

    calculateRelationShipPointCoordinates:function (topic, controlPoint) {
        var size = topic.getSize();
        var position = topic.getPosition();
        var div = (position.x - controlPoint.x);
        div = (Math.abs(div) > 0.1 ? div : 0.1);  // Prevent division by 0.

        var m = (position.y - controlPoint.y) / div;
        var y, x;
        var gap = 5;
        if (controlPoint.y > position.y + (size.height / 2)) {
            y = position.y + (size.height / 2) + gap;
            x = position.x - ((position.y - y) / m);
            if (x > position.x + (size.width / 2)) {
                x = position.x + (size.width / 2);
            } else if (x < position.x - (size.width / 2)) {
                x = position.x - (size.width / 2);
            }
        } else if (controlPoint.y < position.y - (size.height / 2)) {
            y = position.y - (size.height / 2) - gap;
            x = position.x - ((position.y - y) / m);
            if (x > position.x + (size.width / 2)) {
                x = position.x + (size.width / 2);
            } else if (x < position.x - (size.width / 2)) {
                x = position.x - (size.width / 2);
            }
        } else if (controlPoint.x < (position.x - size.width / 2)) {
            x = position.x - (size.width / 2) - gap;
            y = position.y - (m * (position.x - x));
        } else {
            x = position.x + (size.width / 2) + gap;
            y = position.y - (m * (position.x - x));
        }

        return new core.Point(x, y);
    },

    calculateDefaultControlPoints:function (srcPos, tarPos) {
        var y = srcPos.y - tarPos.y;
        var x = srcPos.x - tarPos.x;
        var div = (Math.abs(x) > 0.1 ? x : 0.1);   // Prevent division by 0.

        var m = y / div;
        var l = Math.sqrt(y * y + x * x) / 3;
        var fix = 1;
        if (srcPos.x > tarPos.x) {
            fix = -1;
        }

        var x1 = srcPos.x + Math.sqrt(l * l / (1 + (m * m))) * fix;
        var y1 = m * (x1 - srcPos.x) + srcPos.y;
        var x2 = tarPos.x + Math.sqrt(l * l / (1 + (m * m))) * fix * -1;
        var y2 = m * (x2 - tarPos.x) + tarPos.y;

        return [new core.Point(-srcPos.x + x1, -srcPos.y + y1), new core.Point(-tarPos.x + x2, -tarPos.y + y2)];
    }
};

