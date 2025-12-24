/*
    ハーフトーン生成スクリプト V4.0
    
    Created by Gemini for Adobe Illustrator
*/

(function() {
    if (app.documents.length === 0) {
        alert("ドキュメントを開いてから実行してください。");
        return;
    }

    // =========================================================
    // 1. UI構築
    // =========================================================
    var dialog = new Window("dialog", "ハーフトーン生成 V4.0");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    // --- A. ドット個数パネル ---
    var panelBasic = dialog.add("panel", undefined, "ドット個数");
    panelBasic.orientation = "row";
    panelBasic.alignChildren = ["left", "center"];
    panelBasic.spacing = 20;

    var grpRowCol = panelBasic.add("group");
    grpRowCol.orientation = "row";
    grpRowCol.alignChildren = ["left", "center"];
    
    grpRowCol.add("statictext", undefined, "縦:");
    var inputRows = grpRowCol.add("edittext", undefined, "20");
    inputRows.characters = 5;
    grpRowCol.add("statictext", undefined, "個");

    grpRowCol.add("statictext", undefined, "    "); 

    grpRowCol.add("statictext", undefined, "横:");
    var inputCols = grpRowCol.add("edittext", undefined, "20");
    inputCols.characters = 5;
    grpRowCol.add("statictext", undefined, "個");


    // --- B. シェイプ設定パネル ---
    var panelShape = dialog.add("panel", undefined, "シェイプ設定");
    panelShape.orientation = "column";
    panelShape.alignChildren = ["left", "top"];

    // 形状
    var grpShapeType = panelShape.add("group");
    var rbCircle = grpShapeType.add("radiobutton", undefined, "丸");
    var rbRect = grpShapeType.add("radiobutton", undefined, "四角");
    rbCircle.value = true;

    // サイズ
    var grpSizeInputs = panelShape.add("group");
    grpSizeInputs.orientation = "stack";
    grpSizeInputs.alignChildren = ["left", "center"];

    var grpCircleInput = grpSizeInputs.add("group");
    grpCircleInput.add("statictext", undefined, "直径:");
    var inputDiameter = grpCircleInput.add("edittext", undefined, "10");
    inputDiameter.characters = 5;
    grpCircleInput.add("statictext", undefined, "pt");

    var grpRectInput = grpSizeInputs.add("group");
    grpRectInput.add("statictext", undefined, "幅:");
    var inputRectW = grpRectInput.add("edittext", undefined, "10");
    inputRectW.characters = 4;
    grpRectInput.add("statictext", undefined, "pt   高さ:");
    var inputRectH = grpRectInput.add("edittext", undefined, "10");
    inputRectH.characters = 4;
    grpRectInput.add("statictext", undefined, "pt");
    grpRectInput.visible = false;

    rbCircle.onClick = function() {
        grpCircleInput.visible = true;
        grpRectInput.visible = false;
    }
    rbRect.onClick = function() {
        grpCircleInput.visible = false;
        grpRectInput.visible = true;
    }

    // 間隔
    var grpPitch = panelShape.add("group");
    grpPitch.add("statictext", undefined, "間隔:");
    var inputPitch = grpPitch.add("edittext", undefined, "15");
    inputPitch.characters = 5;
    grpPitch.add("statictext", undefined, "pt");

    // シェイプの回転
    var gIndivRot = panelShape.add("group");
    gIndivRot.add("statictext", undefined, "シェイプの回転:");
    var inputIndivRot = gIndivRot.add("edittext", undefined, "0");
    inputIndivRot.characters = 4;
    gIndivRot.add("statictext", undefined, "°");


    // --- C. パターン設定パネル ---
    var panelPattern = dialog.add("panel", undefined, "パターン");
    panelPattern.orientation = "column";
    panelPattern.alignChildren = ["left", "top"];
    
    // 千鳥配置
    var grpPatRow1 = panelPattern.add("group");
    grpPatRow1.orientation = "row";
    var cbStagger = grpPatRow1.add("checkbox", undefined, "千鳥配置にする");
    cbStagger.value = false;

    // 傾斜設定 (2行に分離)
    var grpPatRow2 = panelPattern.add("group");
    grpPatRow2.orientation = "row";
    grpPatRow2.alignChildren = ["left", "center"];
    
    // 行の傾斜
    grpPatRow2.add("statictext", undefined, "行の傾斜:");
    var inputRowShear = grpPatRow2.add("edittext", undefined, "0");
    inputRowShear.characters = 4;
    grpPatRow2.add("statictext", undefined, "°");

    grpPatRow2.add("statictext", undefined, "   "); // スペース

    // 列の傾斜 [V4追加]
    grpPatRow2.add("statictext", undefined, "列の傾斜:");
    var inputColShear = grpPatRow2.add("edittext", undefined, "0");
    inputColShear.characters = 4;
    grpPatRow2.add("statictext", undefined, "°");


    // --- D. ランダムパネル ---
    var panelRandom = dialog.add("panel", undefined, "ランダム");
    panelRandom.orientation = "column";
    panelRandom.alignChildren = ["left", "top"];

    var grpRand1 = panelRandom.add("group");
    grpRand1.add("statictext", undefined, "位置の乱れ(±):");
    var inputJitter = grpRand1.add("edittext", undefined, "0");
    inputJitter.characters = 4;
    grpRand1.add("statictext", undefined, "pt");

    var grpRand2 = panelRandom.add("group");
    grpRand2.add("statictext", undefined, "サイズの乱れ(±):");
    var inputRandSize = grpRand2.add("edittext", undefined, "0");
    inputRandSize.characters = 4;
    grpRand2.add("statictext", undefined, "pt");

    var grpRand3 = panelRandom.add("group");
    grpRand3.add("statictext", undefined, "回転の乱れ(±):");
    var inputRandRot = grpRand3.add("edittext", undefined, "0");
    inputRandRot.characters = 4;
    grpRand3.add("statictext", undefined, "°");


    // --- E. グラデーション設定パネル ---
    var panelGrad = dialog.add("panel", undefined, "グラデーション");
    panelGrad.orientation = "column";
    panelGrad.alignChildren = ["left", "top"];

    var cbGrad = panelGrad.add("checkbox", undefined, "有効にする");
    cbGrad.value = true;

    var grpScaleMode = panelGrad.add("group");
    grpScaleMode.orientation = "row";
    grpScaleMode.add("statictext", undefined, "変形モード:");
    var rbScaleNormal = grpScaleMode.add("radiobutton", undefined, "通常");
    var rbChangeWidth = grpScaleMode.add("radiobutton", undefined, "幅のみ変形");
    var rbChangeHeight = grpScaleMode.add("radiobutton", undefined, "高さのみ変形");
    rbScaleNormal.value = true;

    var grpGradRow1 = panelGrad.add("group");
    grpGradRow1.orientation = "row";
    grpGradRow1.alignChildren = ["left", "center"];
    grpGradRow1.add("statictext", undefined, "角度:");
    var inputGradAngle = grpGradRow1.add("edittext", undefined, "0");
    inputGradAngle.characters = 4;
    grpGradRow1.add("statictext", undefined, "°");

    var grpGradRow2 = panelGrad.add("group");
    grpGradRow2.orientation = "row";
    grpGradRow2.alignChildren = ["left", "center"];
    grpGradRow2.add("statictext", undefined, "開始:");
    var inputStartVal = grpGradRow2.add("edittext", undefined, "100");
    inputStartVal.characters = 4;
    grpGradRow2.add("statictext", undefined, "%");
    grpGradRow2.add("statictext", undefined, " → ");
    grpGradRow2.add("statictext", undefined, "終了:");
    var inputEndVal = grpGradRow2.add("edittext", undefined, "10");
    inputEndVal.characters = 4;
    grpGradRow2.add("statictext", undefined, "%");

    cbGrad.onClick = function() {
        grpScaleMode.enabled = cbGrad.value;
        grpGradRow1.enabled = cbGrad.value;
        grpGradRow2.enabled = cbGrad.value;
    }


    // --- F. ログ出力設定 ---
    var grpLog = dialog.add("group");
    grpLog.alignment = "left";
    var cbCreateLog = grpLog.add("checkbox", undefined, "設定値をテキストとして出力する");
    cbCreateLog.value = true;


    // --- ボタン ---
    var groupBtn = dialog.add("group");
    groupBtn.alignment = "center";
    var btnCancel = groupBtn.add("button", undefined, "キャンセル", {name: "cancel"});
    var btnOk = groupBtn.add("button", undefined, "生成する", {name: "ok"});

    if (dialog.show() != 1) return;


    // =========================================================
    // 2. 値の取得
    // =========================================================
    var rows = parseInt(inputRows.text) || 10;
    var cols = parseInt(inputCols.text) || 10;
    var pitch = parseFloat(inputPitch.text) || 15;
    
    var isCircleMode = rbCircle.value;
    var baseDiameter = parseFloat(inputDiameter.text) || 10;
    var baseRectW = parseFloat(inputRectW.text) || 10;
    var baseRectH = parseFloat(inputRectH.text) || 10;
    var indivRotation = parseFloat(inputIndivRot.text) || 0;

    var isStagger = cbStagger.value;
    
    // 傾斜角度の取得
    var rowShearAngle = parseFloat(inputRowShear.text) || 0;
    var colShearAngle = parseFloat(inputColShear.text) || 0; // 追加

    var randJitter = parseFloat(inputJitter.text) || 0;
    var randSizePt = parseFloat(inputRandSize.text) || 0;
    var randRot = parseFloat(inputRandRot.text) || 0;

    var useGradient = cbGrad.value;
    var scaleModeText = "通常";
    var scaleMode = 0; 
    if (rbChangeWidth.value) { scaleMode = 1; scaleModeText = "幅のみ変形"; }
    if (rbChangeHeight.value) { scaleMode = 2; scaleModeText = "高さのみ変形"; }

    var gradAngle = parseFloat(inputGradAngle.text) || 0;
    var startDensity = (parseFloat(inputStartVal.text) || 100) / 100;
    var endDensity = (parseFloat(inputEndVal.text) || 0) / 100;

    var createLog = cbCreateLog.value;


    // =========================================================
    // 3. ログ用テキストの作成
    // =========================================================
    var logContent = "Output Log:\r";

    logContent += "[ドット個数]  縦: " + rows + " 個 / 横: " + cols + " 個\r";
    
    var shapeStr = "";
    if (isCircleMode) {
        shapeStr = "形状: 丸 (直径 " + baseDiameter + " pt)";
    } else {
        shapeStr = "形状: 四角 (W " + baseRectW + " x H " + baseRectH + " pt)";
    }
    logContent += "[シェイプ]  " + shapeStr + " / 間隔: " + pitch + " pt / シェイプ回転: " + indivRotation + "°\r";

    // ログに行と列の傾斜を記載
    logContent += "[パターン]  千鳥配置: " + (isStagger ? "ON" : "OFF") + " / 行の傾斜: " + rowShearAngle + "° / 列の傾斜: " + colShearAngle + "°\r";

    var randStr = "";
    if (randJitter==0 && randSizePt==0 && randRot==0) {
        randStr = "なし";
    } else {
        var randParts = [];
        if (randJitter !== 0) randParts.push("位置±" + randJitter + "pt");
        if (randSizePt !== 0) randParts.push("サイズ±" + randSizePt + "pt");
        if (randRot !== 0) randParts.push("回転±" + randRot + "°");
        randStr = randParts.join(" / ");
    }
    logContent += "[ランダム]  " + randStr + "\r";

    var gradStr = "";
    if (!useGradient) {
        gradStr = "OFF";
    } else {
        gradStr = "変形モード: " + scaleModeText + " / 角度: " + gradAngle + "° / 範囲: " + (startDensity*100) + "% -> " + (endDensity*100) + "%";
    }
    logContent += "[グラデーション]  " + gradStr;


    // =========================================================
    // 4. 描画ロジック準備
    // =========================================================
    
    // 行の傾斜 (横ラインの傾き = X移動に伴うYシフト)
    var rowShearRad = rowShearAngle * (Math.PI / 180);
    var rowShearFactor = Math.tan(rowShearRad); 

    // 列の傾斜 (縦ラインの傾き = Y移動に伴うXシフト)
    var colShearRad = colShearAngle * (Math.PI / 180);
    var colShearFactor = Math.tan(colShearRad);

    var rad = gradAngle * (Math.PI / 180);
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    // バウンディングボックスの計算 (2軸傾斜対応)
    var p1 = {x: 0, y: 0};
    
    var gridWidth = (cols - 1) * pitch;
    var gridHeightVisual = -(rows - 1) * pitch; // Yは下に行くほどマイナス

    // P2 (Top-Right): X=Width. 
    // 行傾斜によるYズレ = Width * rowTan
    // 列傾斜によるXズレ = 0 * colTan = 0 (Y=0なので)
    var p2 = {
        x: gridWidth, 
        y: gridWidth * rowShearFactor
    };

    // P3 (Bottom-Left): Y=Height.
    // 行傾斜によるYズレ = 0 * rowTan = 0
    // 列傾斜によるXズレ = Height * colTan
    var p3 = {
        x: gridHeightVisual * colShearFactor,
        y: gridHeightVisual
    };

    // P4 (Bottom-Right): X=Width, Y=Height.
    // X = Width + (Height * colTan)
    // Y = Height + (Width * rowTan)
    var p4 = {
        x: gridWidth + (gridHeightVisual * colShearFactor),
        y: gridHeightVisual + (gridWidth * rowShearFactor)
    };

    var corners = [p1, p2, p3, p4];

    var minProj = Infinity;
    var maxProj = -Infinity;
    for (var i = 0; i < corners.length; i++) {
        var p = corners[i].x * cos + corners[i].y * sin;
        if (p < minProj) minProj = p;
        if (p > maxProj) maxProj = p;
    }
    var projLength = maxProj - minProj;
    if (projLength === 0) projLength = 1;


    // =========================================================
    // 5. 描画実行
    // =========================================================
    var doc = app.activeDocument;
    var d = new Date();
    
    var masterGroup = doc.groupItems.add();
    masterGroup.name = "Halftone_Pattern_" + d.getHours() + d.getMinutes() + d.getSeconds();

    var blackColor = new CMYKColor();
    blackColor.black = 100;

    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            
            var baseX = x * pitch;
            var baseY = -(y * pitch); 

            if (isStagger && (y % 2 !== 0)) {
                baseX += (pitch / 2);
            }

            // 行の傾斜適用 (X座標に応じてYをずらす)
            var shiftY = baseX * rowShearFactor;
            
            // 列の傾斜適用 (Y座標に応じてXをずらす)
            var shiftX = baseY * colShearFactor;

            var gridX = baseX + shiftX;
            var gridY = baseY + shiftY;

            var jitterX = (Math.random() - 0.5) * 2 * randJitter;
            var jitterY = (Math.random() - 0.5) * 2 * randJitter;
            
            var finalX = gridX + jitterX;
            var finalY = gridY + jitterY;

            var scale = 1.0;
            if (useGradient) {
                var currProj = gridX * cos + gridY * sin;
                var t = (currProj - minProj) / projLength;
                if (t < 0) t = 0;
                if (t > 1) t = 1;
                scale = startDensity + t * (endDensity - startDensity);
            }

            var scaleW = scale;
            var scaleH = scale;
            if (scaleMode === 1) { scaleW = scale; scaleH = 1.0; }
            else if (scaleMode === 2) { scaleW = 1.0; scaleH = scale; }

            var currentW = (isCircleMode ? baseDiameter : baseRectW) * scaleW;
            var currentH = (isCircleMode ? baseDiameter : baseRectH) * scaleH;

            if (randSizePt !== 0) {
                var addPt = (Math.random() - 0.5) * 2 * randSizePt;
                currentW += addPt;
                currentH += addPt;
            }

            if (currentW < 0.1) currentW = 0.1;
            if (currentH < 0.1) currentH = 0.1;

            if (currentW < 0.1 || currentH < 0.1) continue;

            var newItem; 
            if (isCircleMode) {
                newItem = masterGroup.pathItems.ellipse(
                    finalY + (currentH / 2),
                    finalX - (currentW / 2),
                    currentW,
                    currentH
                );
            } else {
                newItem = masterGroup.pathItems.rectangle(
                    finalY + (currentH / 2),
                    finalX - (currentW / 2),
                    currentW,
                    currentH
                );
            }
            
            newItem.filled = true;
            newItem.fillColor = blackColor;
            newItem.stroked = false;

            var finalRotation = indivRotation;
            if (randRot !== 0) {
                finalRotation += (Math.random() - 0.5) * 2 * randRot;
            }
            if (finalRotation !== 0) {
                newItem.rotate(finalRotation);
            }
        }
    }


    // =========================================================
    // 6. アートボード中央へ移動
    // =========================================================
    var abIndex = doc.artboards.getActiveArtboardIndex();
    var abRect = doc.artboards[abIndex].artboardRect;
    var abCenterX = abRect[0] + ((abRect[2] - abRect[0]) / 2);
    var abCenterY = abRect[1] - ((abRect[1] - abRect[3]) / 2);

    masterGroup.position = [
        abCenterX - (masterGroup.width / 2),
        abCenterY + (masterGroup.height / 2)
    ];


    // =========================================================
    // 7. ログテキストの配置
    // =========================================================
    if (createLog) {
        var logTextFrame = doc.textFrames.add();
        logTextFrame.contents = logContent;
        logTextFrame.textRange.characterAttributes.size = 5;
        
        var patternLeft = masterGroup.position[0];
        var patternBottom = masterGroup.position[1] - masterGroup.height;
        
        logTextFrame.position = [patternLeft, patternBottom - 15];
    }

})();