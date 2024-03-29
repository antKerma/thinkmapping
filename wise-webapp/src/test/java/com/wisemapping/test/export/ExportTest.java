package com.wisemapping.test.export;

import com.wisemapping.exporter.ExportException;
import com.wisemapping.exporter.ExportFormat;
import com.wisemapping.exporter.ExportProperties;
import com.wisemapping.exporter.ExporterFactory;
import com.wisemapping.importer.ImporterException;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLStreamException;
import javax.xml.transform.TransformerException;
import java.io.*;

@Test
public class ExportTest {
    private static final String DATA_DIR_PATH = "src/test/resources/data/svg/";

    @Test(dataProvider = "Data-Provider-Function")
    public void exportSvgTest(@NotNull final File svgFile, @NotNull final File pngFile) throws ImporterException, IOException, ExportException, TransformerException, XMLStreamException, JAXBException, SAXException, TranscoderException, ParserConfigurationException {

        String svgXml = FileUtils.readFileToString(svgFile, "UTF-8");

        final ExportFormat format = ExportFormat.PNG;
        final ExportProperties properties = ExportProperties.create(format);
        final ExportProperties.ImageProperties imageProperties = (ExportProperties.ImageProperties) properties;
        imageProperties.setSize(ExportProperties.ImageProperties.Size.LARGE);

        String baseUrl = svgFile.getParentFile().getAbsolutePath() + "/../../../../../../wise-editor/src/main/webapp";
        ExporterFactory factory = new ExporterFactory(new File(baseUrl));
        // Write content ...
        if (pngFile.exists()) {
            // Export mile content ...
            final ByteArrayOutputStream bos = new ByteArrayOutputStream();
            factory.export(imageProperties, null, bos, svgXml);
        } else {
            OutputStream outputStream = new FileOutputStream(pngFile, false);
            factory.export(imageProperties, null, outputStream, svgXml);
            outputStream.close();
        }
    }

    //This function will provide the parameter data
    @DataProvider(name = "Data-Provider-Function")
    public Object[][] parameterIntTestProvider() {

        final File dataDir = new File(DATA_DIR_PATH);
        final File[] svgFile = dataDir.listFiles(new FilenameFilter() {

            public boolean accept(File dir, String name) {
                return name.endsWith(".svg");
            }
        });

        final Object[][] result = new Object[svgFile.length][2];
        for (int i = 0; i < svgFile.length; i++) {
            File freeMindFile = svgFile[i];
            final String name = freeMindFile.getName();
            result[i] = new Object[]{freeMindFile, new File(DATA_DIR_PATH, name.substring(0, name.lastIndexOf(".")) + ".png")};
        }

        return result;
    }


}
